
const FullBar = ({ full, state, barStyle = "h-5 border-1 border-primary", fullBarStyle = "bg-green-600", unfullBarStyle = "bg-blue-600" }: { full: number, state: number, barStyle?: HTMLDivElement['className'], fullBarStyle?: HTMLDivElement['className'], unfullBarStyle?: HTMLDivElement['className'] }) => {
    let percent = state / full * 100;
    percent = percent == 0 ? 1 : percent

    return (
        <div className={`w-100 ${barStyle} rounded-md overflow-hidden`}>
            <div className={`h-100 ${percent == 100 ? fullBarStyle : unfullBarStyle}`} style={{ width: `${percent}%` }}></div>
        </div>
    )
}

export default FullBar