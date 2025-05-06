import { customRender } from "../TestUtils";
import { expect, test } from "vitest";
import { CompanyInfo } from "../../pages/CompanyInfo";

test('renders the companyinfo page with text ', async () => {
    const { getByText } = customRender(
        <CompanyInfo />
    )
    expect(getByText('Company Info')).toBeInTheDocument()
    expect(getByText('Chomp-a-Donut thrives on making it\'s customer\'s smile with its fantastic range of donuts.')).toBeInTheDocument()
})