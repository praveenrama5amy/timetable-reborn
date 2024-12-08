
const LoadBar = ({ min, max, value }: { min: number, max: number, value: number }) => {
    return (
        <div className="w-100 border-1 h-5 rounded-lg border-primary text-white relative flex overflow-hidden" style={{ backgroundColor: "rgb(233,233,233)" }}>
            <div className="flex-1 overflow-hidden border-r-2 border-primary">
                <div className="flex justify-center items-center bg-cyan-700 h-100" style={{ width: value / min * 100 + "%" }}>
                    {value < min && value}
                </div>
            </div>
            <div className="flex-1 overflow-hidden border-r-2 border-primary">
                <div className="flex justify-center items-center bg-green-700 h-100" style={{ width: value >= min ? value / max * 100 + "%" : 0 }}>
                    {value >= min && value <= max && value}
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-center items-center bg-red-700 h-100" style={{ width: value > max ? value / (max * 4) * 100 + "%" : 0 }}>
                    {value > max && value}
                </div>
            </div>
        </div>

    )
}

export default LoadBar