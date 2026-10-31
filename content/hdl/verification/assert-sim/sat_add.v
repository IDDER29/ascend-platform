// 4-bit saturating add: a + b, but never more than 15.
module sat_add(input [3:0] a, input [3:0] b, output [3:0] y);
  wire [3:0] s = a + b;
  assign y = (s > 15) ? 4'd15 : s;
endmodule
