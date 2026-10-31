// A 16 x 16 multiplier between registers. Its operands come from two LFSRs (pseudo-random sequences
// made inside the chip, so the design needs few pins); one output pin shows the parity of the product.
module mult(input clk, output reg parity);
  reg [15:0] a = 16'hACE1, b = 16'h1234;
  reg [31:0] p;
  always @(posedge clk) begin
    a <= {a[14:0], a[15] ^ a[13] ^ a[12] ^ a[10]};
    b <= {b[14:0], b[15] ^ b[13] ^ b[12] ^ b[10]};
    p <= a * b;                 // all of the multiply happens between two clock edges
    parity <= ^p;
  end
endmodule
