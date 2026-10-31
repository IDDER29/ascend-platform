module tb;
  reg a, b, c;
  wire y;
  integer i;
  gates dut(.a(a), .b(b), .c(c), .y(y));
  initial begin
    $display("a b c | y");
    for (i = 0; i < 8; i = i + 1) begin
      {a, b, c} = i;
      #1 $display("%b %b %b | %b", a, b, c, y);
    end
    $finish;
  end
endmodule
