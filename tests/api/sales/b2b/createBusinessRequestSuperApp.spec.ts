import {
  validBranchVariables,
  validBusinessRequestVariables,
  validSignContractVariables,
} from "../../../../src/api/sales/testData";
import { saveApiResponse } from "../../../../src/api/saveApiResponse";
import { expect, test } from "../../../../src/fixtures/apiFixture";

test.describe("CreateBusinessRequestSuperApp", () => {
  test.describe.configure({ timeout: 180_000 });

  test(
    "Create Business Request SuperApp - Valid",
    { tag: ["@all-regression", "@sales-app-regression", "@create-b2b-request"] },
    async ({ salesAppEgyptApi }) => {
      // A fresh branch avoids "Branch has already an active request"; the backend
      // also rejects the request unless that branch has a signed contract.
      const branchResponse = await salesAppEgyptApi.sales.createBranch(validBranchVariables());
      expect(
        branchResponse.errors,
        "Branch creation should succeed without GraphQL errors.",
      ).toBeUndefined();

      const branchId = branchResponse.data?.createBranch?.id;
      expect(branchId, "A valid Branch ID should be returned.").toBeTruthy();

      const signResponse = await salesAppEgyptApi.sales.signContractSuperApp(
        validSignContractVariables(branchId!),
      );
      expect(
        signResponse.errors,
        "The contract should be signed without GraphQL errors.",
      ).toBeUndefined();

      const businessRequestVariables = validBusinessRequestVariables(branchId!);
      const response =
        await salesAppEgyptApi.sales.createBusinessRequestSuperApp(businessRequestVariables);
      expect(
        response.errors,
        "createBusinessRequestSuperApp should succeed without GraphQL errors.",
      ).toBeUndefined();

      const created = response.data?.createBusinessRequestSuperApp;
      expect(created, "createBusinessRequestSuperApp should return a request.").toBeDefined();
      expect(created?.id, "A valid Business Request ID should be returned.").toBeTruthy();

      saveApiResponse("businessRequestId", {
        businessRequestId: created!.id,
      });
    },
  );
});
