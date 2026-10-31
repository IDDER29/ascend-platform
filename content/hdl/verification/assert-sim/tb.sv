module tb;
  reg [3:0] a, b;
  wire [3:0] y;
  sat_add dut(.a(a), .b(b), .y(y));
  initial begin
    a = 3; b = 4; #1;
    assert (y >= a && y >= b) else $error("y = %0d is smaller than an input (a = %0d, b = %0d)", y, a, b);
    a = 9; b = 9; #1;
    assert (y >= a && y >= b) else $error("y = %0d is smaller than an input (a = %0d, b = %0d)", y, a, b);
    $display("simulation finished");
    $finish;
  end
endmodule
