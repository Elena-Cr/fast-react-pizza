/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const username = useSelector((state) => state.user.username);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  //return errors which get displayed in the user interface
  const formErrors = useActionData();
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const [withPriority, setWithPriority] = useState(false);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            defaultValue={username}
            required
            className="input grow"
          />
        </div>

        <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="w-full input" />
          </div>
          {/* Conditional rendering of the errors */}
          {formErrors?.phone && (
            <p className="p-2 mt-2 text-xs text-red-700 bg-red-100 rounded-md">
              {formErrors?.phone}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="w-full input"
            />
          </div>
        </div>

        <div className="flex items-center gap-5 mb-12">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="w-6 h-6 transition-all duration-300 focus:ring-offset-2 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? "Placing Order"
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  //ERROR HANDLING INSIDE THE FORM
  const errors = {};
  if (!isValidPhone(order?.phone))
    errors.phone =
      "Please put a correct phone number, we might need it to contact you.";
  if (Object.keys(errors).length > 0) return errors;

  //IF NO ERRORS, CREATE NEW ORDER AND REDIRECT
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}
export default CreateOrder;
