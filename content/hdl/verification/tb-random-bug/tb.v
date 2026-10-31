module tb;
  reg [3:0] a, b;
  wire [3:0] y;
  integer seed, n, expected, fails;
  sat_add dut(.a(a), .b(b), .y(y));
  initial begin
    seed = 42;       // a fixed seed: the same "random" tests on every run
    fails = 0;
    for (n = 0; n < 20; n = n + 1) begin
      a = $urandom(seed) % 16;
      b = $urandom(seed) % 16;
      #1;
      expected = (a + b > 15) ? 15 : a + b;
      if (y !== expected) begin
        if (fails == 0) $display("FAIL on test %0d: %0d + %0d gave %0d, expected %0d", n, a, b, y, expected);
        fails = fails + 1;
      end
    end
    $display("%0d of 20 random tests failed", fails);
    $finish;
  end
endmodule
