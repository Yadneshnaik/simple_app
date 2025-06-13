'use client';

import { useState, useRef, useEffect } from 'react';

const songs = [
	{
		id: 1,
		title: 'Hale Dil',
		artist: 'Murder 2 - Harshit Saxena',
		url: '/audio/Hale Dil.mp3',
		image: '/images/hale-dil.jpg',
	},
	{
		id: 2,
		title: 'Phir Mohabbat',
		artist: 'Murder 2 - Arijit Singh',
		url: '/audio/Phir Mohabbat.mp3',
		image: '/images/phir-mohabbat.jpg',
	},
	{
		id: 3,
		title: 'Sultan',
		artist: 'Ravi Basrur',
		url: '/audio/Sultan.mp3',
		image: '/images/sultan.jpg',
	},
];

export default function Home() {
	const [darkMode, setDarkMode] = useState(false);
	const [currentSong, setCurrentSong] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef(null);
	const progressRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;

		const updateProgress = () => {
			if (audio?.duration) {
				setProgress((audio.currentTime / audio.duration) * 100);
			}
		};

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};

		if (audio) {
			audio.addEventListener('timeupdate', updateProgress);
			audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		}

		const handleKeydown = (e) => {
			if (e.code === 'Space') {
				e.preventDefault();
				handlePlay(currentSong);
			} else if (e.code === 'ArrowRight') handleForward();
			else if (e.code === 'ArrowLeft') handleRewind();
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			audio?.removeEventListener('timeupdate', updateProgress);
			audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
			window.removeEventListener('keydown', handleKeydown);
		};
	}, [currentSong]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	const toggleDark = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle('dark', !darkMode);
	};

	const handlePlay = (song) => {
	if (currentSong?.id === song.id && isPlaying) {
		audioRef.current.pause();
		setIsPlaying(false);
	} else {
		setCurrentSong(song);
		setIsPlaying(false);

		// Wait for audio to load before playing
		setTimeout(() => {
			const audio = audioRef.current;
			if (!audio) return;

			audio.load(); // Force reload audio
			audio.oncanplay = () => {
				audio.play().then(() => {
					setIsPlaying(true);
				}).catch((err) => {
					console.error("Error playing audio:", err);
				});
			};
		}, 0);
	}
};

	const handlePrev = () => {
		if (!currentSong) return;
		const idx = songs.findIndex((s) => s.id === currentSong.id);
		const prevIdx = (idx - 1 + songs.length) % songs.length;
		setCurrentSong(songs[prevIdx]);
		setTimeout(() => {
			audioRef.current.play();
			setIsPlaying(true);
		}, 0);
	};

	const handleNext = () => {
		if (!currentSong) return;
		const idx = songs.findIndex((s) => s.id === currentSong.id);
		const nextIdx = (idx + 1) % songs.length;
		setCurrentSong(songs[nextIdx]);
		setTimeout(() => {
			audioRef.current.play();
			setIsPlaying(true);
		}, 0);
	};

	const handleForward = () => {
		if (audioRef.current) {
			audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
		}
	};

	const handleRewind = () => {
		if (audioRef.current) {
			audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
		}
	};

	const handleProgressChange = (e) => {
		const audio = audioRef.current;
		const newTime = (e.target.value / 100) * audio.duration;
		audio.currentTime = newTime;
		setProgress(e.target.value);
	};

	const formatTime = (sec) => {
		const minutes = Math.floor(sec / 60);
		const seconds = Math.floor(sec % 60);
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
	};

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all pb-28">
			<div className="p-6 flex justify-between items-center">
				<h1 className="text-2xl font-bold">🎵 Music Player</h1>
				<button
					onClick={toggleDark}
					className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded text-sm"
				>
					{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
				</button>
			</div>

			<div className="px-6">
				<h2 className="text-xl font-semibold mb-4">🎧 Your Songs</h2>
				<ul className="space-y-4">
					{songs.map((song) => (
						<li
							key={song.id}
							className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
						>
							<div className="flex items-center gap-4">
								<img
									src={song.image}
									alt={song.title}
									className="w-12 h-12 rounded object-cover border"
								/>
								<div>
									<p className="font-medium">{song.title}</p>
									<p className="text-sm text-gray-600 dark:text-gray-300">
										{song.artist}
									</p>
								</div>
							</div>
							<button
								onClick={() => handlePlay(song)}
								className={`px-4 py-2 bg-blue-600 text-white rounded hover:scale-105 transition-transform ${currentSong?.id === song.id && isPlaying ? 'bg-red-600' : ''
									}`}
							>
								{currentSong?.id === song.id && isPlaying ? '⏸ Pause' : '▶ Play'}
							</button>
						</li>
					))}
				</ul>
			</div>

			{currentSong && (
				<div className="fixed bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-4 shadow-lg">
					<div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
						{/* Song Info */}
						<div className="flex items-center gap-4 w-full md:w-auto">
							<img
								src={currentSong.image}
								alt={currentSong.title}
								className="w-16 h-16 rounded object-cover border"
							/>
							<div>
								<p className="font-semibold">{currentSong.title}</p>
								<p className="text-sm text-gray-600 dark:text-gray-300">{currentSong.artist}</p>
							</div>
						</div>

						{/* Audio + Controls */}
						<div className="flex flex-col items-center w-full md:w-auto gap-2">
							<audio ref={audioRef} src={currentSong.url} onEnded={handleNext} />

							{/* Progress */}
							<div className="flex items-center gap-2 w-full">
								<span className="text-xs">{formatTime(audioRef.current?.currentTime || 0)}</span>
								<input
									type="range"
									ref={progressRef}
									value={progress}
									onChange={handleProgressChange}
									className="w-full accent-blue-500"
								/>
								<span className="text-xs">{formatTime(duration)}</span>
							</div>

							{/* Buttons */}
							<div className="flex gap-2 items-center justify-center">
								<button onClick={handlePrev} className="btn">⏮</button>
								<button onClick={handleRewind} className="btn">⏪</button>
								<button onClick={() => handlePlay(currentSong)} className="btn px-4">
									{isPlaying ? '⏸' : '▶'}
								</button>
								<button onClick={handleForward} className="btn">⏩</button>
								<button onClick={handleNext} className="btn">⏭</button>
							</div>
						</div>

						{/* Volume */}
						<div className="flex items-center gap-2 w-full md:w-auto">
							🔊
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={volume}
								onChange={(e) => setVolume(parseFloat(e.target.value))}
								className="accent-blue-500"
							/>
						</div>
					</div>
				</div>
			)}

			<style jsx>{`
				.btn {
					padding: 0.5rem;
					background: #4b5563;
					color: white;
					border-radius: 0.25rem;
					transition: transform 0.1s ease-in-out;
				}
				.btn:hover {
					transform: scale(1.05);
				}
			`}</style>
		</div>
	);
}
