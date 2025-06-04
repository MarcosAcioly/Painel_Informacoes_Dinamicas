import { ApiClient } from '../core/ApiClient.js';
 
class MusicService {
    constructor() {
        this.apiClient = new ApiClient();
        // Nota: Para uma implementação real, você precisaria de uma API de música como Spotify ou Last.fm
        // Este é um exemplo com dados simulados
    }
    
    async search(query) {
        // Em uma implementação real, você faria uma chamada à API
        // Retornando dados simulados para teste
        return {
            tracks: {
                items: [
                    {
                        id: '1',
                        name: 'Exemplo de Música',
                        artists: [{ name: 'Artista Exemplo' }],
                        album: {
                            name: 'Álbum Exemplo',
                            images: [{ url: '' }, { url: 'https://via.placeholder.com/300' }],
                            release_date: '2023-01-01'
                        },
                        preview_url: null,
                        external_urls: { spotify: 'https://spotify.com' }
                    }
                ]
            }
        };
    }
    
    async getTopTracks() {
        // Dados simulados
        return {
            tracks: [
                {
                    id: '1',
                    name: 'Top Música 1',
                    artists: [{ name: 'Artista Popular' }],
                    album: {
                        name: 'Álbum Popular',
                        images: [{ url: '' }, { url: 'https://via.placeholder.com/300' }],
                        release_date: '2023-01-01'
                    },
                    preview_url: null,
                    external_urls: { spotify: 'https://spotify.com' },
                    popularity: 95
                }
            ]
        };
    }
    
    async getTrackDetails(trackId) {
        // Dados simulados
        return {
            id: trackId,
            name: 'Detalhes da Música',
            artists: [{ name: 'Artista Exemplo' }],
            album: {
                name: 'Álbum Exemplo',
                images: [{ url: 'https://via.placeholder.com/600' }],
                release_date: '2023-01-01'
            },
            preview_url: null,
            external_urls: { spotify: 'https://spotify.com' },
            popularity: 80
        };
    }
}

export { MusicService }

export async function getMusic() {
    // Exemplo de dados estáticos (substitua por chamada real de API se desejar)
    return [
        { artist: 'The Beatles', song: 'Hey Jude' },
        { artist: 'Queen', song: 'Bohemian Rhapsody' },
        { artist: 'Michael Jackson', song: 'Billie Jean' },
        { artist: 'Adele', song: 'Rolling in the Deep' },
        { artist: 'Ed Sheeran', song: 'Shape of You' }
    ];
}

// Busca músicas por nome (gravações) - MusicBrainz
export async function searchMusic(query) {
    const url = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json&limit=10`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    // Retorna lista simplificada
    return data.recordings.map(rec => ({
        id: rec.id,
        title: rec.title,
        artist: rec['artist-credit'] && rec['artist-credit'][0]?.name,
        release: rec.releases && rec.releases[0]?.title,
        date: rec.releases && rec.releases[0]?.date,
        mbid: rec.id
    }));
}

// Busca detalhes de uma música (gravação) pelo MBID - MusicBrainz
export async function getMusicDetails(mbid) {
    const url = `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artists+releases&fmt=json`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });
    return await response.json();
}