function ShimmerEffect() {
    return (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/90 dark:via-white/20 to-transparent skew-x-12 pointer-events-none" />
    )
}

export default ShimmerEffect
