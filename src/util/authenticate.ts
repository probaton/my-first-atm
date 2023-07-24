export async function authenticate(accountNr: number, pin: string): Promise<boolean> {
  try {
    const authResponse = await fetch(`http://localhost:3001/auth?accountNr=${accountNr}&pin=${pin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const authData = await authResponse.json();
    return authData.success;
  } catch (e) {
    console.error("Authentication request failed:", e);
    return false;
  }
}
