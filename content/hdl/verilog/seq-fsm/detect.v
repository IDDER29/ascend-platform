// A Moore state machine that sets found for one cycle after the input bits 1, 0, 1 arrive in a row.
module detect101(input clk, input rst, input bit_in, output found);
  localparam IDLE = 2'd0, GOT1 = 2'd1, GOT10 = 2'd2, DONE = 2'd3;
  reg [1:0] state, next;

  // The state register: the only part that uses the clock.
  always @(posedge clk) begin
    if (rst) state <= IDLE;
    else state <= next;
  end

  // The next-state logic: combinational, a case over the current state and the input.
  always @* begin
    case (state)
      IDLE:    next = bit_in ? GOT1 : IDLE;
      GOT1:    next = bit_in ? GOT1 : GOT10;
      GOT10:   next = bit_in ? DONE : IDLE;
      default: next = bit_in ? GOT1 : GOT10; // DONE: its last 1 can start a new 101
    endcase
  end

  assign found = (state == DONE);
endmodule
