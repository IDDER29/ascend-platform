module tb;
  reg [3:0] a, b;
  reg cin;
  wire [3:0] sum;
  wire cout;
  integer i, errors = 0;
  adder4 dut(.a(a), .b(b), .cin(cin), .sum(sum), .cout(cout));
  initial begin
    a = 9; b = 8; cin = 0;
    #1 $display("9 + 8 = %0d, carry out %b", sum, cout);
    for (i = 0; i < 512; i = i + 1) begin
      {a, b, cin} = i;
      #1 if ({cout, sum} !== a + b + cin) errors = errors + 1;
    end
    $display("checked all 512 inputs against a + b + cin: %0d errors", errors);
    $finish;
  end
endmodule
