// y is (a AND b) OR c. The two assigns are written "out of order" on purpose:
// they are two pieces of hardware that exist at the same time, not steps.
module gates(input a, input b, input c, output y);
  wire t;
  assign y = t | c;
  assign t = a & b;
endmodule
