// An 8-bit adder, described by what it does.
module add8(input [7:0] a, input [7:0] b, output [8:0] sum);
  assign sum = a + b;
endmodule
