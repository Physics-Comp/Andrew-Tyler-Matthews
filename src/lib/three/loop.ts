/**
 * requestAnimationFrame loop that only runs while the page is visible and the host
 * element is on screen. Frame callbacks receive a clamped delta in seconds.
 */
export interface RenderLoop {
	dispose(): void;
}

export function createRenderLoop(host: HTMLElement, onFrame: (dt: number) => void): RenderLoop {
	let disposed = false;
	let running = false;
	let raf = 0;
	let last = 0;
	let pageVisible = !document.hidden;
	let inView = true;

	function frame(now: number) {
		if (!running) return;
		const dt = Math.min(0.05, (now - last) / 1000) || 0;
		last = now;
		onFrame(dt);
		raf = requestAnimationFrame(frame);
	}

	function update() {
		const shouldRun = pageVisible && inView && !disposed;
		if (shouldRun && !running) {
			running = true;
			last = performance.now();
			raf = requestAnimationFrame(frame);
		} else if (!shouldRun && running) {
			running = false;
			cancelAnimationFrame(raf);
		}
	}

	function onVisibilityChange() {
		pageVisible = !document.hidden;
		update();
	}
	document.addEventListener('visibilitychange', onVisibilityChange);

	const intersection = new IntersectionObserver(([entry]) => {
		inView = entry.isIntersecting;
		update();
	});
	intersection.observe(host);
	update();

	return {
		dispose() {
			disposed = true;
			update();
			document.removeEventListener('visibilitychange', onVisibilityChange);
			intersection.disconnect();
		}
	};
}
