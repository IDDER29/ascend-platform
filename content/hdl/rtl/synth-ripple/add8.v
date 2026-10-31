// The same 8-bit adder, described by how to build it: eight full adders in a chain.
module full_adder(input a, input b, input cin, output s, output cout);
  assign s = a ^ b ^ cin;
  assign cout = (a & b) | (cin & (a ^ b));
endmodule

module add8(input [7:0] a, input [7:0] b, output [8:0] sum);
  wire [8:0] c;
  assign c[0] = 1'b0;
  genvar i;
  generate
    for (i = 0; i < 8; i = i + 1) begin : bit_slice
      full_adder fa(.a(a[i]), .b(b[i]), .cin(c[i]), .s(sum[i]), .cout(c[i + 1]));
    end
  endgenerate
  assign sum[8] = c[8];
endmodule
