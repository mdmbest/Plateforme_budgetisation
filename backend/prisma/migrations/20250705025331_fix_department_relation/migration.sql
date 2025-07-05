-- DropForeignKey
ALTER TABLE "budget_requests" DROP CONSTRAINT "budget_requests_department_fkey";

-- AddForeignKey
ALTER TABLE "budget_requests" ADD CONSTRAINT "budget_requests_department_fkey" FOREIGN KEY ("department") REFERENCES "departments"("name") ON DELETE SET NULL ON UPDATE CASCADE;
