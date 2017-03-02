import { expect } from "chai";
import helloController from "./hello";

describe("web#controllers", function() {
  describe("hello controller", function() {
    it("should set $scope.hello to 'Hello'", function() {
      let scope = {};
      helloController(scope);
      expect(scope.hello).to.equal("Hello");
    });
  });
});
