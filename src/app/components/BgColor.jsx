function BgColor() {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div
                className="absolute -top-14 -right-14 w-52 h-52 bg-white/20 dark:bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow"
                style={{ transform: 'translate3d(0, 0, 0)' }}
            />
            <div
                className="absolute top-1/2 -left-28 w-80 h-80 bg-white/10 dark:bg-teal-400/20 rounded-full blur-4xl animate-pulse"
                style={{ transform: 'translate3d(0, 0, 0)' }}
            />
        </div>
    )
}

export default BgColor
