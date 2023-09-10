import {makeDelay} from '../assets/js/makeDelay';

test('makeDelay makes delay 1000', async () => {
    const result = await makeDelay(1000);
    expect(result).toBe('Timeout 1000ms has been finished')
})

test('makeDelay makes delay 0', async () => {
    const result = await makeDelay(0);
    expect(result).toBe('Timeout 0ms has been finished')
})