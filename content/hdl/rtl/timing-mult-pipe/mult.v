// The same multiplier, split into two pipeline stages: the four 8 x 8 partial products are registered,
// then added in the next cycle. Each stage has less logic between its registers.
module mult(input clk, output reg parity);
  reg [15:0] a = 16'hACE1, b = 16'h1234;
  reg [15:0] ll, lh, hl, hh;    // stage 1: partial products
  reg [31:0] p;                 // stage 2: their sum
  always @(posedge clk) begin
    a <= {a[14:0], a[15] ^ a[13] ^ a[12] ^ a[10]};
    b <= {b[14:0], b[15] ^ b[13] ^ b[12] ^ b[10]};
    ll <= a[7:0] * b[7:0];
    lh <= a[7:0] * b[15:8];
    hl <= a[15:8] * b[7:0];
    hh <= a[15:8] * b[15:8];
    p <= ll + ({16'd0, lh} << 8) + ({16'd0, hl} << 8) + ({hh, 16'd0});
    parity <= ^p;
  end
endmodule
