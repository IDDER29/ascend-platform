// Checks every operation on every pair of 8-bit inputs against a reference model.
module tb;
    reg  [7:0] a, b;
    reg  [2:0] op;
    wire [7:0] y;
    wire zero, carry;
    alu dut (.a(a), .b(b), .op(op), .y(y), .zero(zero), .carry(carry));

    reg [8:0] want;
    integer i, j, k, errors, checks;

    initial begin
        errors = 0;
        checks = 0;
        for (k = 0; k < 8; k = k + 1)
            for (i = 0; i < 256; i = i + 1)
                for (j = 0; j < 256; j = j + 1) begin
                    a = i; b = j; op = k;
                    #1;
                    case (k)
                        0: want = i + j;
                        1: want = {1'b0, a} - {1'b0, b};
                        2: want = i & j;
                        3: want = i | j;
                        4: want = i ^ j;
                        5: want = ($signed(a) < $signed(b)) ? 1 : 0;
                        6: want = (i << (j % 8)) & 8'hFF;
                        7: want = i >> (j % 8);
                    endcase
                    checks = checks + 1;
                    if (y !== want[7:0] || zero !== (want[7:0] == 0) || ((k < 2) && carry !== want[8])) begin
                        if (errors < 5)
                            $display("FAIL op=%0d a=%0d b=%0d: y=%0d carry=%b, want y=%0d carry=%b", k, a, b, y, carry, want[7:0], want[8]);
                        errors = errors + 1;
                    end
                end
        $display("%0d checks, %0d errors", checks, errors);
        $finish;
    end
endmodule
