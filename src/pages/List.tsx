import { useMemo, useState, useEffect } from "react";
import { SpinningLoader } from "../components/SpinningLoader";
import { Donut, useGetDonuts } from "../hooks/useGetDonuts";

const borderStyle = "border px-4 py-2";

const SESSION_ITEM = {
    CHOMPED_DONUTS: "chompedDonuts",
    DONUTS: "donuts",
}

export function List() {
    const [retry, setRetry] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [chompedDonuts, setChompedDonuts] = useState<Set<number>>(
        new Set(JSON.parse(sessionStorage.getItem(SESSION_ITEM.CHOMPED_DONUTS) ?? "[]"))
    );
    /**
     * We could preload the donuts or fetch and save in cache, depending on the application needs.
     * But given that this is a small app and we are not mutating the data or truly fetching it
     * from a server, we can just fetch it on demand in a custom hook here.
     */
    const { donuts, loading, error } = useGetDonuts(retry);
    const activeDonuts: Donut[] = useMemo(() => {
        const donutsFromSession = sessionStorage.getItem(SESSION_ITEM.DONUTS);
        if (donutsFromSession && donuts.length > 0) {
            const parsedDonuts = JSON.parse(donutsFromSession);
            //check if parsedDonuts has the same items as donuts, although not necessarily the same order
            const isSame = parsedDonuts.length === donuts.length && parsedDonuts.every((donut: Donut) => {
                return donuts.some((d: Donut) => d.id === donut.id);
            });
            if (isSame) {
                return parsedDonuts;
            } else {
                //if not, we can assume that the available donuts have changed via the server and we should use the new ones
                sessionStorage.setItem(SESSION_ITEM.DONUTS, JSON.stringify(donuts));
                sessionStorage.removeItem(SESSION_ITEM.CHOMPED_DONUTS);
                return donuts
            }
        } else {
            return donuts;
        }
    }, [donuts]);

    const hasDonuts = useMemo(() => activeDonuts.length > 0, [activeDonuts]);
    const hasChompedAllDonuts = useMemo(
        () => activeDonuts.length > 0 && activeDonuts.length === chompedDonuts.size,
        [activeDonuts, chompedDonuts]
    );

    useEffect(() => {
        if (donuts.length > 0 && chompedDonuts.size > 0) {
            sessionStorage.setItem(SESSION_ITEM.DONUTS, JSON.stringify(donuts));
            sessionStorage.setItem(SESSION_ITEM.CHOMPED_DONUTS, JSON.stringify([...chompedDonuts]));
        }
    }, [donuts, chompedDonuts]);

    const handleChomp = (id: number, price: number) => {
        setTotalCost((prev) => prev + price);
        setChompedDonuts((prev) => new Set(prev).add(id));
    };

    const handleReset = () => {
        setTotalCost(0);
        setChompedDonuts(new Set());
        sessionStorage.removeItem(SESSION_ITEM.CHOMPED_DONUTS);
        sessionStorage.removeItem(SESSION_ITEM.DONUTS);
    };

    return (
        <div className="flex flex-col">
            {loading && <SpinningLoader />}
            {!hasDonuts && <h1 className="text-center font-bold mb-4">Sadly we have no available donuts at this time.</h1>}
            {!loading && !error && (
                <>
                    {hasDonuts && (
                        <>
                            <div className="pt-12">
                                <h1 className="text-center font-bold mb-4">Fresh from the oven</h1>
                                <h2 className="text-center mb-6">
                                    Built to destroy diets and hearts, one bite at a time.
                                </h2>
                            </div>
                            <div className="overflow-x-auto w-11/12 mx-auto">
                                <div className="my-4 text-right flex justify-end items-center">
                                    {hasChompedAllDonuts && <div className="font-bold mr-4">Such wow! You have chomped all the donuts! Why not have another go!</div>}
                                    <button
                                        disabled={chompedDonuts.size === 0}
                                        onClick={handleReset}
                                        className="px-4 py-2 rounded"
                                    >
                                        Reset
                                    </button>
                                </div>
                                {/**
                                 * I would normally lean towards a component library for a table, which have
                                 * Virtualizated Rows, pagination, accessibility etc. outof the box
                                 * But here I am just using a simple html table for simplicity
                                 */}
                                <table className="table-auto w-full border-collapse border">
                                    <thead>
                                        <tr>
                                            <th className={borderStyle}>Image</th>
                                            <th className={borderStyle}>Name</th>
                                            <th className={borderStyle}>Price</th>
                                            <th className={borderStyle}>Chomp-a-donut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeDonuts.map((donut) => (
                                            <tr
                                                key={donut.name}
                                                className={`text-center ${chompedDonuts.has(donut.id) ? "opacity-50" : ""}`}
                                            >
                                                <td className={`${borderStyle} py-4`}>
                                                    <img
                                                        src={`/${donut.imageName}.svg`}
                                                        alt={donut.name}
                                                        className="w-24 object-cover mx-auto"
                                                    />
                                                </td>
                                                <td className={borderStyle}>{donut.name}</td>
                                                <td className={borderStyle}>£{donut.price}</td>
                                                <td className={borderStyle}>
                                                    <button
                                                        onClick={() => handleChomp(donut.id, donut.price)}
                                                        className="px-4 py-2 rounded"
                                                        disabled={chompedDonuts.has(donut.id)}
                                                    >
                                                        Chomp
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    <div className="w-11/12 flex justify-end mt-4 mx-auto">
                        <div className="w-1/3 flex justify-end p-4">
                            <h3 className="text-right text-xl">Total Cost: £{totalCost.toFixed(2)}</h3>
                        </div>
                    </div>
                </>
            )}
            {error && (
                <div className="py-12 flex flex-wrap justify-center">
                    <h1 className="w-full text-red-500">Failed to load donuts.</h1>
                    <button
                        onClick={() => setRetry((prev) => prev + 1)}
                        className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}