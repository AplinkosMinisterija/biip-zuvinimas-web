const sentTickets = new Set<string>();

export const claimEGatesTicket = (ticket: string) => {
  if (sentTickets.has(ticket)) return false;

  sentTickets.add(ticket);
  return true;
};

export const getSearchWithoutEGatesTicket = (search: string, ticket: string) => {
  const params = new URLSearchParams(search);
  if (params.get('ticket') !== ticket) return;

  params.delete('ticket');
  return params.toString();
};
