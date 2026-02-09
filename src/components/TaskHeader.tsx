export function TaskHeader() {
    return (
        <div className="p-8 pb-0 flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-main-dark leading-tight tracking-tight">
                    Task Dashboard
                </h1>
                <p className="text-secondary-gray text-sm">Professional workflow management</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                <span className="material-symbols-outlined text-sm text-secondary-gray">
                    calendar_today
                </span>
                <span className="text-xs font-semibold text-secondary-gray uppercase tracking-wider">
                    Oct 24, 2023
                </span>
            </div>
        </div>
    );
}
