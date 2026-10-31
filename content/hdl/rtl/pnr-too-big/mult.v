// A 32 x 32 multiplier between registers, with operands from two LFSRs.
module mult(input clk, output reg parity);
  reg [31:0] a = 32'hACE1ACE1, b = 32'h12345678;
  reg [63:0] p;
  always @(posedge clk) begin
    a <= {a[30:0], a[31] ^ a[21] ^ a[1] ^ a[0]};
    b <= {b[30:0], b[31] ^ b[21] ^ b[1] ^ b[0]};
    p <= a * b;
    parity <= ^p;
  end
endmodule
