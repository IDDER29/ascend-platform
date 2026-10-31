module tb;
  reg [3:0] a, b;
  wire [3:0] y;
  integer i, j, expected, fails;
  sat_add dut(.a(a), .b(b), .y(y));
  initial begin
    fails = 0;
    for (i = 0; i < 16; i = i + 1)
      for (j = 0; j < 16; j = j + 1) begin
        a = i; b = j;
        #1;
        expected = (i + j > 15) ? 15 : i + j;   // the reference model
        if (y !== expected) begin
          if (fails < 3) $display("FAIL: %0d + %0d gave %0d, expected %0d", a, b, y, expected);
          fails = fails + 1;
        end
      end
    $display("%0d of 256 cases failed", fails);
    $finish;
  end
endmodule
