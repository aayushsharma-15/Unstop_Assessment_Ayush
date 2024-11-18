document.addEventListener('DOMContentLoaded', () => {
  // Grab references to HTML elements
  const grid = document.getElementById('seat-grid'); // The container where seats will be rendered
  const seatCountInput = document.getElementById('seat-count'); // Input field for seat count
  const reserveBtn = document.getElementById('reserve-btn'); // Reserve button to trigger booking
  const bookedSeatsDisplay = document.getElementById('booked-seats'); // Display booked seats

  // Define the layout of the seat grid
  const rows = 11; // Total number of rows
  const seatsPerRow = 7; // Number of seats per row
  const lastRowSeats = 3; // Number of seats in the last row (special case)
  const seats = []; // Array to hold seat objects

  // Generate seat layout
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      // In the last row, only allow 3 seats to be available
      if (i === rows - 1 && j > lastRowSeats) break;
      // Create a seat object with an ID (e.g., A1, A2) and status (default: available)
      seats.push({ id: `${String.fromCharCode(65 + i)}${j}`, status: 'available' });
    }
  }

  // Function to render the seat grid in the DOM
  const renderSeats = () => {
    grid.innerHTML = ''; // Clear the current seat grid
    seats.forEach((seat) => {
      // Create a div for each seat and set its class based on its status (available/reserved)
      const seatDiv = document.createElement('div');
      seatDiv.className = `seat ${seat.status}`;
      seatDiv.textContent = seat.id; // Set seat ID (e.g., A1, B2) as text content
      grid.appendChild(seatDiv); // Add seat div to the grid
    });
  };

  // Function to book a specified number of consecutive seats
  const bookSeats = (count) => {
    // Find all available seats
    const availableSeats = seats.filter(seat => seat.status === 'available');
    if (availableSeats.length < count) {
      alert('Not enough seats available.'); // Alert if not enough seats are available
      return;
    }

    const bookedSeats = []; // Array to keep track of booked seat IDs
    let remainingSeats = count; // Number of seats still to be booked

    // Group seats by row
    const rowGroups = seats.reduce((acc, seat) => {
      const rowId = seat.id[0]; // Get the row letter (A, B, C, etc.)
      if (!acc[rowId]) acc[rowId] = []; // Initialize the row group if it doesn't exist
      acc[rowId].push(seat); // Add seat to the row group
      return acc;
    }, {});

    // Try to find a row with enough available seats
    for (const rowId in rowGroups) {
      const rowSeats = rowGroups[rowId].filter(seat => seat.status === 'available');
      if (rowSeats.length >= remainingSeats) {
        // If a row has enough available seats, book them
        for (let i = 0; i < remainingSeats; i++) {
          rowSeats[i].status = 'reserved'; // Mark the seat as reserved
          bookedSeats.push(rowSeats[i].id); // Add the seat ID to the booked seats array
        }
        renderSeats(); // Re-render the seat grid
        bookedSeatsDisplay.textContent = bookedSeats.join(', '); // Display the booked seats
        return;
      }
    }

    // If no row has enough seats, try booking nearby seats across different rows
    const sortedAvailableSeats = availableSeats.sort((a, b) => {
      // Sort seats by their row first (A, B, C, etc.), then by seat number
      const aRow = a.id.charCodeAt(0);
      const bRow = b.id.charCodeAt(0);
      const aSeat = parseInt(a.id.slice(1), 10);
      const bSeat = parseInt(b.id.slice(1), 10);
      return aRow === bRow ? aSeat - bSeat : aRow - bRow;
    });

    // Book remaining seats from the sorted list of available seats
    for (let i = 0; i < sortedAvailableSeats.length && remainingSeats > 0; i++) {
      sortedAvailableSeats[i].status = 'reserved'; // Mark seat as reserved
      bookedSeats.push(sortedAvailableSeats[i].id); // Add seat ID to booked seats
      remainingSeats--; // Decrement the remaining seats to book
    }

    renderSeats(); // Re-render the seat grid
    bookedSeatsDisplay.textContent = bookedSeats.join(', '); // Display booked seats
  };

  // Event listener for when the reserve button is clicked
  reserveBtn.addEventListener('click', () => {
    const count = parseInt(seatCountInput.value, 10); // Get the number of seats to book
    if (isNaN(count) || count < 1 || count > 7) {
      alert('Please enter a number between 1 and 7.'); // Alert if invalid seat count
      return;
    }
    bookSeats(count); // Call the bookSeats function with the input count
  });

  renderSeats(); // Initial rendering of the seat grid when the page loads
});
