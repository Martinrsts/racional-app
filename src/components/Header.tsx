const Header = () => {
  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[15px] font-semibold text-slate-900 leading-tight">
            Racional
          </div>
          <div className="text-[11px] text-slate-400 leading-tight">
            Portfolio Dashboard
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
