import { useEffect, useState } from 'react';
import styles from './App.module.css';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function App() {
	const [minHeight, setMinHeight] = useState(Math.round((window.innerHeight - 80) * 0.1));
	const [maxHeight, setMaxHeight] = useState(Math.round(window.innerHeight - 80));
	const [barCount, setBarCount] = useState(100);
	const [bars, setBars] = useState([]);
	const [sorted, setSorted] = useState([]);
	const [done, setDone] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			const windowHeight = window.innerHeight - 80;
			setMaxHeight(Math.round(windowHeight));
			setMinHeight(Math.round(windowHeight * 0.1));
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const generateBars = () => {
		setBars([]);
		setSorted([]);
		setDone(true);

		const random = [];
		for (let i = 0; i < barCount; i++) {
			random.push(Math.round(Math.random() * (maxHeight - minHeight) + minHeight));
		}
		setBars(random);
	};

	useEffect(() => {
		generateBars();
	}, [barCount]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			generateBars();
		}, 500);

		return () => {
			clearTimeout(timeout);
		};
	}, [minHeight, maxHeight]);

	const sortBars = async () => {
		const copy = [...bars];
		const swapOrder = [];
		let swapped = true;
		while (swapped) {
			swapped = false;
			for (let i = 0; i < copy.length - 1; i++) {
				if (copy[i] > copy[i + 1]) {
					const temp = copy[i];
					copy[i] = copy[i + 1];
					copy[i + 1] = temp;
					swapOrder.push([i, i + 1]);
					swapped = true;
				}
			}
		}

		setSorted(copy);
		setDone(false);
		const interval = setInterval(() => {
			const [x, y] = swapOrder.shift();
			setBars((bars) => {
				const copied = [...bars];
				const temp = copied[x];
				copied[x] = copied[y];
				copied[y] = temp;
				return copied;
			});

			if (!swapOrder.length) {
				clearInterval(interval);
				setDone(true);
			}
		}, (200 - barCount) / (barCount / 5));
	};

	return (
		<div className={styles.app}>
			<div className={styles.container}>
				<div className={styles.nav}>
					<label className={styles.amount} htmlFor='amount'>
						Size: {barCount}
					</label>
					<input
						type='range'
						name='amount'
						max={150}
						min={50}
						value={barCount}
						disabled={!done}
						onChange={(e) => setBarCount(e.target.value)}
					/>
					<button
						onClick={generateBars}
						disabled={!done}
						className={classNames(styles.btn, styles.gen)}
					>
						Generate
					</button>
					<button
						onClick={sortBars}
						disabled={!done}
						className={classNames(styles.btn, styles.sort)}
					>
						Sort
					</button>
				</div>
				<div className={styles.bars}>
					{bars.map((bar, index) => (
						<div
							className={classNames(
								styles.bar,
								bar === sorted[index] ? styles.sorted : styles.unsorted
							)}
							style={{ height: `${bar}px` }}
							key={index}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
