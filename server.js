import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import ID3 from "node-id3";
import { fileURLToPath } from 'url';
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let musicFolder = path.join(__dirname, "music");
let playlistsFile = path.join(__dirname, "playlists.json");

// Create music folder if it doesn't exist
if (!fs.existsSync(musicFolder)) {
    fs.mkdirSync(musicFolder, { recursive: true });
}

// Initialize playlists file if it doesn't exist
if (!fs.existsSync(playlistsFile)) {
    fs.writeFileSync(playlistsFile, JSON.stringify([], null, 2));
}

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, musicFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Função para obter metadados da música
function getSongMetadata(file, filePath) {
    const metadata = ID3.read(filePath) || {};
    const stats = fs.statSync(filePath);
    
    // Calcular duração aproximada (idealmente, use ffprobe ou biblioteca específica)
    // Esta é uma estimativa grosseira baseada no tamanho do arquivo
    const approximateDuration = Math.floor(stats.size / 16000); // ~128kbps
    
    return {
        id: file,
        title: metadata.title || file.replace('.mp3', ''),
        artist: metadata.artist || "Desconhecido",
        album: metadata.album || "Desconhecido",
        year: metadata.year || "",
        genre: metadata.genre || "",
        duration: approximateDuration,
        durationFormatted: formatDuration(approximateDuration),
        coverUrl: metadata.image?.imageBuffer 
            ? `data:${metadata.image.mime};base64,${metadata.image.imageBuffer.toString('base64')}`
            : undefined,
        path: filePath,
        addedAt: stats.birthtime
    };
}

// Formatar duração em MM:SS
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Rota para listar músicas
app.get("/api/songs", (req, res) => {
    fs.readdir(musicFolder, (err, files) => {
        if (err) return res.status(500).json({ error: "Erro ao ler pasta" });
        
        const songs = files
            .filter(file => file.endsWith(".mp3"))
            .map(file => {
                const filePath = path.join(musicFolder, file);
                return getSongMetadata(file, filePath);
            });
        
        res.json(songs);
    });
});

// Rota para buscar músicas
app.get("/api/search", (req, res) => {
    const query = req.query.q?.toLowerCase();
    if (!query) return res.json([]);

    fs.readdir(musicFolder, (err, files) => {
        if (err) return res.status(500).json({ error: "Erro ao ler pasta" });
        
        const songs = files
            .filter(file => file.endsWith(".mp3"))
            .map(file => {
                const filePath = path.join(musicFolder, file);
                return getSongMetadata(file, filePath);
            })
            .filter(song => 
                song.title.toLowerCase().includes(query) || 
                song.artist.toLowerCase().includes(query) || 
                song.album.toLowerCase().includes(query)
            );
        
        res.json(songs);
    });
});

// Rota para servir o stream de música
app.get("/api/songs/:id", (req, res) => {
    const filePath = path.join(musicFolder, decodeURIComponent(req.params.id));
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Música não encontrada" });
    }

    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        const stream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg'
        });
        stream.pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': stat.size,
            'Content-Type': 'audio/mpeg'
        });
        fs.createReadStream(filePath).pipe(res);
    }
});

// Rota para obter detalhes de uma música específica
app.get("/api/songs/:id/details", (req, res) => {
    const filePath = path.join(musicFolder, decodeURIComponent(req.params.id));
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Música não encontrada" });
    }
    
    const song = getSongMetadata(req.params.id, filePath);
    res.json(song);
});

// Rota para upload de músicas
app.post("/api/upload", upload.array("files"), (req, res) => {
    try {
        const uploadedFiles = req.files.map(file => {
            const filePath = path.join(musicFolder, file.filename);
            return getSongMetadata(file.filename, filePath);
        });
        
        res.json({
            message: `${uploadedFiles.length} música(s) enviadas com sucesso!`,
            songs: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao fazer upload" });
    }
});

// Rotas para playlists
app.get("/api/playlists", (req, res) => {
    try {
        const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf8'));
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter playlists" });
    }
});

app.post("/api/playlists", (req, res) => {
    try {
        const { name, description = "", imageUrl = "" } = req.body;
        if (!name) return res.status(400).json({ error: "Nome da playlist é obrigatório" });
        
        const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf8'));
        const newPlaylist = {
            id: Date.now().toString(),
            name,
            description,
            imageUrl,
            songs: [],
            createdAt: new Date().toISOString()
        };
        
        playlists.push(newPlaylist);
        fs.writeFileSync(playlistsFile, JSON.stringify(playlists, null, 2));
        
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar playlist" });
    }
});

app.get("/api/playlists/:id", (req, res) => {
    try {
        const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf8'));
        const playlist = playlists.find(p => p.id === req.params.id);
        
        if (!playlist) return res.status(404).json({ error: "Playlist não encontrada" });
        
        // Buscar detalhes completos das músicas
        const songsWithDetails = [];
        for (const songId of playlist.songs) {
            const filePath = path.join(musicFolder, songId);
            if (fs.existsSync(filePath)) {
                songsWithDetails.push(getSongMetadata(songId, filePath));
            }
        }
        
        res.json({...playlist, songs: songsWithDetails});
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter playlist" });
    }
});

app.post("/api/playlists/:id/songs", (req, res) => {
    try {
        const { songId } = req.body;
        if (!songId) return res.status(400).json({ error: "ID da música é obrigatório" });
        
        // Verificar se a música existe
        const songPath = path.join(musicFolder, songId);
        if (!fs.existsSync(songPath)) {
            return res.status(404).json({ error: "Música não encontrada" });
        }
        
        const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf8'));
        const playlistIndex = playlists.findIndex(p => p.id === req.params.id);
        
        if (playlistIndex === -1) return res.status(404).json({ error: "Playlist não encontrada" });
        
        // Adicionar música se ela ainda não estiver na playlist
        if (!playlists[playlistIndex].songs.includes(songId)) {
            playlists[playlistIndex].songs.push(songId);
            fs.writeFileSync(playlistsFile, JSON.stringify(playlists, null, 2));
        }
        
        res.json(playlists[playlistIndex]);
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar música à playlist" });
    }
});

app.delete("/api/playlists/:playlistId/songs/:songId", (req, res) => {
    try {
        const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf8'));
        const playlistIndex = playlists.findIndex(p => p.id === req.params.playlistId);
        
        if (playlistIndex === -1) return res.status(404).json({ error: "Playlist não encontrada" });
        
        playlists[playlistIndex].songs = playlists[playlistIndex].songs.filter(
            id => id !== req.params.songId
        );
        
        fs.writeFileSync(playlistsFile, JSON.stringify(playlists, null, 2));
        res.json({ message: "Música removida da playlist" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover música da playlist" });
    }
});

// Rota para estatísticas do usuário
app.get("/api/stats", (req, res) => {
    try {
        // Ler músicas para estatísticas
        const files = fs.readdirSync(musicFolder).filter(file => file.endsWith(".mp3"));
        const songs = files.map(file => {
            const filePath = path.join(musicFolder, file);
            return getSongMetadata(file, filePath);
        });
        
        // Ler playlists
        const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf8'));
        
        const stats = {
            totalSongs: songs.length,
            totalDuration: songs.reduce((acc, song) => acc + song.duration, 0),
            totalPlaylists: playlists.length,
            topArtists: getTopItems(songs, 'artist', 5),
            topAlbums: getTopItems(songs, 'album', 5),
            recentlyAdded: songs.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)).slice(0, 10),
            genres: getGenreStats(songs)
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
});

// Função auxiliar para obter itens mais frequentes
function getTopItems(songs, field, limit) {
    const counts = {};
    songs.forEach(song => {
        const value = song[field];
        if (value && value !== "Desconhecido") {
            counts[value] = (counts[value] || 0) + 1;
        }
    });
    
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
}

// Função auxiliar para estatísticas de gêneros
function getGenreStats(songs) {
    const counts = {};
    songs.forEach(song => {
        if (song.genre && song.genre !== "") {
            const genres = Array.isArray(song.genre) ? song.genre : [song.genre];
            genres.forEach(genre => {
                counts[genre] = (counts[genre] || 0) + 1;
            });
        }
    });
    
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));
}

// Rota para definir a pasta de músicas
app.post("/api/folder", (req, res) => {
    const { folderPath } = req.body;
    if (!fs.existsSync(folderPath)) {
        return res.status(400).json({ error: "Pasta inválida" });
    }
    musicFolder = folderPath;
    res.json({ message: "Pasta de músicas atualizada!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});