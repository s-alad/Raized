import { Cl } from '@stacks/transactions';
import { describe, expect, it } from "vitest";


const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("donate function tests", () => {
  it('donates 10', () => {
    const startResponse = simnet.callPublicFn('Campaign', 'start', [Cl.uint(100), Cl.uint(10), Cl.uint(3)], address1);
    expect(startResponse.result).toBeOk(Cl.bool(true));
  });
});
