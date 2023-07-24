export type ScreenStateId = "welcome"
  | "submitPin"
  | "options"
  | "balance"
  | "withdraw"
  | "withdrawOther"
  | "withdrawSuccess"
  | "processing"
  | "failure"

export interface ScreenState {
  id: ScreenStateId,
  value?: string;
}

export function getScreenTexts({ id: state, value }: ScreenState) {
  return screenStates[state](value || "");
}

const welcome = () => [`
Welcome to My First Bank
Please insert your card
`];

const submitPin = (value?: string) => [`
Submit your four-digit
PIN below
${value}
`];

const options = () => [
  "What would you like to do today?",
  "Check balance",
  "Withdraw",
];

const balance = (value?: string) => [`
Current balance
$${value}
`];

const withdraw = () => [
  "Select amount", "$20", "$40", "$60", "$80", "$100", "$200", "$1000", "Other",
];

const withdrawSuccess = (value: string) => [`
Withdrawal successful
New balance: $${value}
`];

const withdrawOther = (value: string) => [`
Select amount
Only $20 bills available
$${value || "0"}
`];

const processing = () => ["Processing..."];

const failure = (value?: string) => [value || `
Transaction failed
Please try again later
`];

const screenStates: Record<ScreenStateId, (value: string) => string[]> = {
  welcome,
  submitPin,
  options,
  balance,
  withdraw,
  withdrawSuccess,
  withdrawOther,
  processing,
  failure,
};
