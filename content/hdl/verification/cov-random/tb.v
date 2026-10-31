module tb;
  reg [7:0] a, b;
  wire [7:0] sum;
  wire carry, zero;
  integer seed, n, fails;
  // Functional coverage: how often each interesting case was exercised.
  integer hit_carry, hit_zero, hit_equal, hit_max;
  add8 dut(.a(a), .b(b), .sum(sum), .carry(carry), .zero(zero));

  task check;
    begin
      #1;
      if ({carry, sum} !== a + b || zero !== ((a + b) % 256 == 0)) begin
        if (fails == 0) $display("FAIL: %0d + %0d gave sum %0d carry %0d zero %0d", a, b, sum, carry, zero);
        fails = fails + 1;
      end
      if (a + b > 255) hit_carry = hit_carry + 1;
      if ((a + b) % 256 == 0) hit_zero = hit_zero + 1;
      if (a == b) hit_equal = hit_equal + 1;
      if (a == 255 || b == 255) hit_max = hit_max + 1;
    end
  endtask

  initial begin
    seed = 7; fails = 0;
    hit_carry = 0; hit_zero = 0; hit_equal = 0; hit_max = 0;
    for (n = 0; n < 100; n = n + 1) begin
      a = $urandom(seed); b = $urandom(seed);
      check;
    end
    $display("%0d failures in %0d tests", fails, n);
    $display("coverage: carry %0d, sum wraps to zero %0d, a == b %0d, an operand is 255 %0d",
             hit_carry, hit_zero, hit_equal, hit_max);
    $finish;
  end
endmodule
