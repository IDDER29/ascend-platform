module full_adder(input a, input b, input cin, output sum, output cout);
  assign sum  = a ^ b ^ cin;
  assign cout = (a & b) | (cin & (a ^ b));
endmodule

// Four full adders in a chain: each carry out feeds the next carry in.
module adder4(input [3:0] a, input [3:0] b, input cin, output [3:0] sum, output cout);
  wire [4:0] c;
  assign c[0] = cin;
  genvar i;
  generate
    for (i = 0; i < 4; i = i + 1) begin : stage
      full_adder fa(.a(a[i]), .b(b[i]), .cin(c[i]), .sum(sum[i]), .cout(c[i + 1]));
    end
  endgenerate
  assign cout = c[4];
endmodule
