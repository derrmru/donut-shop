import MainDonut from '../assets/donut-main.svg'
import { Link } from "react-router-dom";

export function Home() {
    return <>
        <div className="py-12">
            <h1>LRQA Donuts</h1>
            <h2>Welcome to the Donut Shop!</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
            <Link to="/list" className="flex flex-col items-center justify-center w-full">
                <img
                    src={MainDonut}
                    alt="Main Donut Logo"
                    className="w-1/2 lg:w-auto max-h-1/2 max-w-150 hover-wiggle transition duration-250 ease-in-out hover:scale-102"
                />
            </Link>
        </div>
    </>
}