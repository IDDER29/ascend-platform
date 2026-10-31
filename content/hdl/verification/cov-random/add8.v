// 8-bit adder with flags: carry out, and zero when the 8-bit sum is 0.
module add8(input [7:0] a, input [7:0] b, output [7:0] sum, output carry, output zero);
  assign {carry, sum} = a + b;
  assign zero = (a + b == 0);
endmodule
