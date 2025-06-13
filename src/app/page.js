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

export default function ThunderMusic() {
	const [showWelcome, setShowWelcome] = useState(true);
	const [currentSong, setCurrentSong] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef(null);
	const progressRef = useRef(null);

	// Setup audio event listeners
	useEffect(() => {
		if (!currentSong) return;

		const audio = audioRef.current;

		const updateProgress = () => {
			if (audio?.duration) {
				setProgress((audio.currentTime / audio.duration) * 100);
			}
		};

		const onLoadedMetadata = () => setDuration(audio.duration);
		const onEnded = () => handleNext();

		audio.addEventListener('timeupdate', updateProgress);
		audio.addEventListener('loadedmetadata', onLoadedMetadata);
		audio.addEventListener('ended', onEnded);

		return () => {
			audio.removeEventListener('timeupdate', updateProgress);
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
			audio.removeEventListener('ended', onEnded);
		};
	}, [currentSong]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	const handlePlay = (song) => {
		const audio = audioRef.current;

		if (currentSong?.id === song.id && isPlaying) {
			audio.pause();
			setIsPlaying(false);
		} else {
			setCurrentSong(song);
			setIsPlaying(false);

			setTimeout(() => {
				audio.load();
				audio.oncanplay = () => {
					audio.play()
						.then(() => setIsPlaying(true))
						.catch(console.error);
				};
			}, 0);
		}
	};

	const handlePrev = () => {
		if (!currentSong) return;
		const index = songs.findIndex((s) => s.id === currentSong.id);
		const prev = (index - 1 + songs.length) % songs.length;
		handlePlay(songs[prev]);
	};

	const handleNext = () => {
		if (!currentSong) return;
		const index = songs.findIndex((s) => s.id === currentSong.id);
		const next = (index + 1) % songs.length;
		handlePlay(songs[next]);
	};

	const handleForward = () => {
		const audio = audioRef.current;
		if (audio) audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
	};

	const handleRewind = () => {
		const audio = audioRef.current;
		if (audio) audio.currentTime = Math.max(audio.currentTime - 10, 0);
	};

	const handleProgressChange = (e) => {
		const audio = audioRef.current;
		const newTime = (e.target.value / 100) * audio.duration;
		audio.currentTime = newTime;
		setProgress(e.target.value);
	};

	const formatTime = (sec) => {
		const m = Math.floor(sec / 60);
		const s = Math.floor(sec % 60);
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	};

	if (showWelcome) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-center">
				<h1 className="text-5xl font-extrabold mb-4">Thunder Music</h1>
				<p className="text-xl mb-6">Feel the vibe of music you love!</p>
				<button
					onClick={() => setShowWelcome(false)}
					className="px-8 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
				>
					Enter Music World
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
			<header className="p-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
				<h1 className="text-2xl font-bold">🎵 Thunder Music</h1>
			</header>

			{/* Banner */}
			<section className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-10">
				<h2 className="text-3xl font-bold mb-2">🔥 New Songs</h2>
				<p className="text-sm opacity-90">Just dropped! Tap to listen now.</p>
			</section>

			{/* Song List */}
			<main className="px-6 py-6 space-y-4">
				{songs.map((song) => (
					<div key={song.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
						<div className="flex items-center gap-4">
							<img src={song.image} alt={song.title} className="w-14 h-14 rounded-lg object-cover" />
							<div>
								<h3 className="font-semibold text-lg">{song.title}</h3>
								<p className="text-sm text-gray-500 dark:text-gray-300">{song.artist}</p>
							</div>
						</div>
						<button
							onClick={() => handlePlay(song)}
							className={`px-5 py-2 rounded-full font-bold text-white transition ${currentSong?.id === song.id && isPlaying ? 'bg-red-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
						>
							{currentSong?.id === song.id && isPlaying ? '⏸ Pause' : '▶ Play'}
						</button>
					</div>
				))}
			</main>

			{/* Music Controls */}
			{currentSong && (
				<footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg px-6 py-4">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						{/* Song Info */}
						<div className="flex items-center gap-4 w-full md:w-auto">
							<img src={currentSong.image} alt="cover" className="w-14 h-14 rounded-md object-cover" />
							<div>
								<p className="font-semibold">{currentSong.title}</p>
								<p className="text-sm text-gray-500 dark:text-gray-300">{currentSong.artist}</p>
							</div>
						</div>

						{/* Audio Element + Controls */}
						<div className="flex flex-col gap-2 items-center w-full md:w-auto">
							<audio ref={audioRef} src={currentSong.url} preload="metadata" />
							<div className="flex items-center gap-2 w-full">
								<span className="text-xs">{formatTime(audioRef.current?.currentTime || 0)}</span>
								<input
									type="range"
									value={progress}
									onChange={handleProgressChange}
									className="w-full accent-indigo-500"
								/>
								<span className="text-xs">{formatTime(duration)}</span>
							</div>

							{/* Playback Buttons */}
							<div className="flex items-center gap-2">
								<button onClick={handlePrev} className="btn">⏮</button>
								<button onClick={handleRewind} className="btn">⏪</button>
								<button onClick={() => handlePlay(currentSong)} className="btn text-lg">{isPlaying ? '⏸' : '▶'}</button>
								<button onClick={handleForward} className="btn">⏩</button>
								<button onClick={handleNext} className="btn">⏭</button>
							</div>
						</div>

						{/* Volume */}
						<div className="flex items-center gap-2">
							<span>🔊</span>
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={volume}
								onChange={(e) => setVolume(parseFloat(e.target.value))}
								className="accent-indigo-500"
							/>
						</div>
					</div>
				</footer>
			)}

			<style jsx>{`
				.btn {
					padding: 0.5rem;
					background: #4b5563;
					color: white;
					border-radius: 0.375rem;
					transition: all 0.2s ease-in-out;
				}
				.btn:hover {
					transform: scale(1.05);
				}
			`}</style>
		</div>
	);
}
