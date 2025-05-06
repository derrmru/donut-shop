import { useMemo, useState, useEffect, Fragment } from "react";
import { SpinningLoader } from "../components/SpinningLoader";
import { Snackbar } from "../components/Snackbar";
import { Donut, useGetDonuts } from "../hooks/useGetDonuts";

const SESSION_ITEM = {
    CHOMPED_DONUTS: "chompedDonuts",
    DONUTS: "donuts",
}

export function List() {
    const [retry, setRetry] = useState<number>(0);
    // const [totalCost, setTotalCost] = useState<number>(0);
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
        setChompedDonuts((prev) => new Set(prev).add(id));
    };

    const handleReset = () => {
        setChompedDonuts(new Set());
        sessionStorage.removeItem(SESSION_ITEM.CHOMPED_DONUTS);
        sessionStorage.removeItem(SESSION_ITEM.DONUTS);
    };

    const totalCost = useMemo(() => {
        return [...chompedDonuts].reduce((acc, id) => {
            const donut = activeDonuts.find((d) => d.id === id);
            if (donut) {
                return acc + donut.price;
            }
            return acc;
        }, 0)
    }, [chompedDonuts])

    return (
        <div className="flex flex-col">
            {loading && <SpinningLoader />}
            {!hasDonuts && !error && <h1 className="text-center font-bold my-4">Sadly we have no available donuts at this time.</h1>}
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
                            <div className="w-11/12 mx-auto">
                                <div className="my-4 grid grid-cols-4 gap-4 items-center">
                                    <div className="font-bold col-span-3" />
                                    <button
                                        disabled={chompedDonuts.size === 0}
                                        onClick={handleReset}
                                        className="px-4 py-2 my-4 mx-auto rounded col-span-1 w-full md:w-1/2"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-4 w-full">
                                    <div className="font-bold text-center">Image</div>
                                    <div className="font-bold text-center">Name</div>
                                    <div className="font-bold text-center">Price</div>
                                    <div className="font-bold text-center">Chomp-a-donut</div>
                                    {activeDonuts.map((donut) => (
                                        <Fragment key={donut.id}>
                                            <div
                                                className={`flex items-center py-4 ${chompedDonuts.has(donut.id) ? "opacity-50" : ""}`}
                                            >
                                                <img
                                                    src={`/${donut.imageName}.svg`}
                                                    alt={donut.name}
                                                    className="w-24 object-cover mx-auto"
                                                />
                                            </div>
                                            <div
                                                className={`flex justify-center items-center ${chompedDonuts.has(donut.id) ? "opacity-50" : ""}`}
                                            >
                                                {donut.name}
                                            </div>
                                            <div
                                                className={`flex justify-center items-center ${chompedDonuts.has(donut.id) ? "opacity-50" : ""}`}
                                            >
                                                £{donut.price}
                                            </div>
                                            <div
                                                className={`flex justify-center items-center ${chompedDonuts.has(donut.id) ? "opacity-50" : ""}`}
                                            >
                                                <button
                                                    onClick={() => handleChomp(donut.id, donut.price)}
                                                    className="px-4 py-2 rounded"
                                                    disabled={chompedDonuts.has(donut.id)}
                                                >
                                                    Chomp
                                                </button>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="w-11/12 grid grid-cols-4 gap-4 mx-auto mb-16">
                        <div className="col-span-3" />
                        <div className="col-span-1 p-4">
                            <h3 className="text-center text-xl">Total Cost: £{totalCost.toFixed(2)}</h3>
                        </div>
                    </div>
                </>
            )}
            {
                error && (
                    <div className="py-12 flex flex-wrap justify-center">
                        <h1 className="w-full text-red-500">Failed to load donuts.</h1>
                        <button
                            onClick={() => setRetry((prev) => prev + 1)}
                            className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                )
            }
            <Snackbar
                message="Such wow! You have chomped all the donuts! Why not have another go!"
                open={hasChompedAllDonuts}
                onClose={handleReset}
                closeMessage="Reset"
            />
        </div>
    )
}