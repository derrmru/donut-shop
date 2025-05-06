export function SpinningLoader() {
    return (
        <div className="flex items-center justify-center my-12">
            <div className="relative w-16 h-16 rounded-full border-4 border-t-blue-900 border-pink-900 animate-spin-slow" />
        </div>
    );
}