module tb;
  reg a = 0, b = 0, c = 0;
  wire y;
  gates dut(.a(a), .b(b), .c(c), .y(y));
  initial begin
    $dumpfile("waves.vcd");
    $dumpvars(0, tb);
    #10 a = 1;
    #10 b = 1;
    #10 a = 0;
    #10 c = 1;
    #10 c = 0; b = 0;
    #10 $finish;
  end
endmodule
