interface WithdrawResponse {
  success: boolean;
  message?: string;
  balance: string;
}

function getBaseUrl(accountNr: number, pin: string): string {
  return `http://localhost:3001/balance?accountNr=${accountNr}&pin=${pin}`;
}

export async function checkBalance(accountNr: number, pin: string): Promise<string> {
  try {
    const authResponse = await fetch(getBaseUrl(accountNr, pin));
    const authData = await authResponse.json();
    return authData?.balance || "0";
  } catch (e) {
    console.error("Balance request failed:", e);
    return "0";
  }
}

export async function withdraw(accountNr: number, pin: string, amount: number): Promise<WithdrawResponse> {
  try {
    const authResponse = await fetch(getBaseUrl(accountNr, pin), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount }),
    });
    return authResponse.json();
  } catch (e) {
    console.error("Balance request failed:", e);
    return {
      success: false,
      message: "Transaction failed",
      balance: "0",
    };
  }
}
