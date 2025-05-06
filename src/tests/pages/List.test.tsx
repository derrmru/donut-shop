import { customRender } from "../TestUtils";
import { afterEach, expect, test } from "vitest";
import { List } from "../../pages/List";
import { serviceWorker } from "../mocks/server";
import { http, HttpResponse } from "msw";

afterEach(() => {
    window.sessionStorage.clear();
    serviceWorker.resetHandlers();
})

test("When no donuts are loaded, we have a message indicating this", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([]);
            },
            { once: true }
        )
    )
    //WHEN
    const { findByText } = customRender(<List />);
    const noDonutsMessage = await findByText("Sadly we have no available donuts at this time.")
    //THEN
    expect(noDonutsMessage).toBeInTheDocument()
})

test("when donuts are loaded they are all found", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        name: "Pink heart",
                        price: 1.5,
                        imageName: "pink-heart.png",
                    },
                    {
                        id: 2,
                        name: "The tiger",
                        price: 2.5,
                        imageName: "the-tiger.png",
                    },
                    {
                        id: 3,
                        name: "Iced delight",
                        price: 3.5,
                        imageName: "iced-delight.png",
                    },
                ]);
            },
            { once: true }
        )
    )
    const { findByText, findAllByRole } = customRender(<List />);

    expect(await findByText("Pink heart")).toBeInTheDocument()
    expect(await findByText("The tiger")).toBeInTheDocument()
    expect(await findByText("Iced delight")).toBeInTheDocument()
    expect(await findAllByRole("img")).toHaveLength(3)
})

test("when fetching donuts fails, we show an error message and a retry button", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return new HttpResponse('failed', { status: 500 })
            },
            { once: true }
        )
    )
    //WHEN
    const { findByText } = customRender(<List />);
    const errorMessage = await findByText("Failed to load donuts.")
    const retryButton = await findByText("Retry")
    //THEN
    expect(errorMessage).toBeInTheDocument()
    expect(retryButton).toBeInTheDocument()
    expect(retryButton).toBeEnabled()
})

test("if a failed fetch is retried, donuts are fetched again", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return new HttpResponse('failed', { status: 500 })
            },
            { once: true }
        ),
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        name: "Pink heart",
                        price: 1.5,
                        imageName: "pink-heart.png",
                    },
                    {
                        id: 2,
                        name: "The tiger",
                        price: 2.5,
                        imageName: "the-tiger.png",
                    },
                    {
                        id: 3,
                        name: "Iced delight",
                        price: 3.5,
                        imageName: "iced-delight.png",
                    },
                ]);
            },
            { once: true }
        )
    )
    //WHEN
    const { findByText } = customRender(<List />);
    const retryButton = await findByText("Retry")
    retryButton.click()
    //THEN
    expect(await findByText("Failed to load donuts.")).not.toBeInTheDocument()
    expect(await findByText("Pink heart")).toBeInTheDocument()
    expect(await findByText("The tiger")).toBeInTheDocument()
    expect(await findByText("Iced delight")).toBeInTheDocument()
})

test("chomping a donut adds to total and disables the chomp button", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        name: "Pink heart",
                        price: 1.5,
                        imageName: "pink-heart.png",
                    }
                ]);
            },
            { once: true }
        )
    )
    //WHEN
    const { findByText, findByRole } = customRender(<List />);
    // const chompButton = await findAllByRole("button", { name: "Chomp" })
    const row = await findByText("Pink heart")
    const chompButton = await findByRole("button", { name: "Chomp" })
    chompButton?.click()
    //THEN
    const totalCost = await findByText("Total Cost: £1.50")
    expect(row).toBeInTheDocument()
    expect(chompButton).toBeDisabled()
    expect(totalCost).toBeInTheDocument()
})

test("it is possible to reset the chomped donuts", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        name: "Pink heart",
                        price: 1.5,
                        imageName: "pink-heart",
                    }
                ]);
            },
            { once: true }
        )
    )
    //WHEN
    const { findByText, findByRole } = customRender(<List />);
    const chompButton = await findByRole("button", { name: "Chomp" })
    chompButton?.click()
    const resetButton = await findByText("Reset")
    resetButton.click()
    const totalCost = await findByText("Total Cost: £0.00")
    //THEN
    expect(chompButton).toBeEnabled()
    expect(totalCost).toBeInTheDocument()
})

test("it is not possible to reset the chomped donuts if none are chomped", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        name: "Pink heart",
                        price: 1.5,
                        imageName: "pink-heart",
                    }
                ]);
            },
            { once: true }
        )
    )
    //WHEN
    const { findByText } = customRender(<List />);
    const resetButton = await findByText("Reset")
    //THEN
    expect(resetButton).toBeDisabled()
})

test("if all donuts are chomped, we show a message", async () => {
    //GIVEN
    serviceWorker.use(
        http.get(
            "/donuts.json",
            () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        name: "Pink heart",
                        price: 1.5,
                        imageName: "pink-heart",
                    },
                    {
                        id: 2,
                        name: "The tiger",
                        price: 2.5,
                        imageName: "the-tiger",
                    },
                    {
                        id: 3,
                        name: "Iced delight",
                        price: 3.5,
                        imageName: "iced-delight",
                    },
                ]);
            },
            { once: true }
        )
    )
    //WHEN
    const { findAllByRole, findByText } = customRender(<List />);
    const chompButtons = await findAllByRole("button", { name: "Chomp" })
    chompButtons.forEach((button: { click: () => void; }) => button.click())
    const message = await findByText("Such wow! You have chomped all the donuts! Why not have another go!")
    //THEN
    expect(message).toBeInTheDocument()
})

