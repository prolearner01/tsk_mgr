export function TaskHeader() {
    return (
        <div className="p-8 pb-4 flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold text-main-dark leading-tight tracking-tight">
                    Task Manager
                </h1>
                <p className="text-secondary-gray text-sm font-medium">Professional workflow management</p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-purple-50 px-4 py-2 rounded-full border border-primary-100/50 shadow-sm transition-transform hover:scale-105">
                <span className="material-symbols-outlined text-sm text-primary-600">
                    calendar_today
                </span>
                <span className="text-xs font-bold text-primary-900 uppercase tracking-wider">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
        </div>
    );
}
