import { useEffect, useState } from "react";

export function App() {
    const [time, setTime] = useState()
    var a = 1
    var b = 2


    setInterval(() => {
        let time = new Date()        
        setTime(time)
    },1000)


    return (
        <div>
            <h1>Time</h1>
            <p>{time && time.toLocaleTimeString()}</p>
        </div>
    );
}

// export function DisplayPerson({ name, age }) {
//   return (
//     <div>
//       <p>
//         {name} is {age} years old
//       </p>
//     </div>
//   );
// }
