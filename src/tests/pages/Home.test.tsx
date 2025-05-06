import { expect, test } from 'vitest'
import { Home } from '../../pages/Home'
import { customRender } from '../TestUtils'

test('properly handles form inputs', async () => {
    const { getByText } = customRender(
        <Home />
    )
    expect(getByText(/LRQA/i)).toBeInTheDocument()
})

test('the donut image is present', async () => {
    const { getByAltText } = customRender(
        <Home />
    )
    expect(getByAltText(/Main Donut Logo/i)).toBeInTheDocument()
})