"use client";

export const Appbar = ({ onPublish }: { onPublish: () => void }) => {
    return (
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-lg">Z</div>
                <span className="font-bold text-xl tracking-tight">Zappy</span>
            </div>
            <button 
                onClick={onPublish}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
            >
                Publish Zap
            </button>
        </header>
    )
}