// A 32-bit accumulator: adds an 8-bit input into a running total on every clock edge.
module acc32(input clk, input rst, input [7:0] in, output reg [31:0] total);
  always @(posedge clk) begin
    if (rst) total <= 0;
    else total <= total + in;
  end
endmodule
