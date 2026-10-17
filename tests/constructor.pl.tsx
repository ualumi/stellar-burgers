import { expect, test, type Page } from '@playwright/test';

const API_URL = 'https://norma.education-services.ru/api';

const BUN_NAME = 'Тестовая булка';
const MAIN_NAME = 'Тестовая начинка';
const ORDER_NUMBER = '123456';

const addIngredient = async (
  page: Page,
  ingredientName: string,
): Promise<void> => {
  const ingredient = page
    .getByText(ingredientName, { exact: true })
    .first();

  const ingredientCard = ingredient.locator(
    'xpath=ancestor::li[1]',
  );

  await ingredientCard
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const openIngredientModal = async (
  page: Page,
  ingredientName: string,
): Promise<void> => {
  await page
    .getByText(ingredientName, { exact: true })
    .first()
    .click();

  await expect(
    page.getByRole('heading', {
      name: 'Детали ингредиента',
    }),
  ).toBeVisible();
};

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(
      'tests/hars/constructor.har',
      {
        url: `${API_URL}/**`,
        update: false,
      },
    );
  });

  test('adds a bun and a filling to the constructor', async ({
    page,
  }) => {
    await page.goto('/');

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    await expect(
      page.getByText(`${BUN_NAME} (верх)`, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(`${BUN_NAME} (низ)`, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(MAIN_NAME, {
        exact: true,
      }).last(),
    ).toBeVisible();
  });

  test('opens the selected ingredient modal and closes it with the close button', async ({
    page,
  }) => {
    await page.goto('/');

    await openIngredientModal(page, MAIN_NAME);

    await expect(page).toHaveURL(
      /\/ingredients\/main-1$/,
    );

    const modal = page
      .getByRole('heading', {
        name: 'Детали ингредиента',
      })
      .locator('xpath=../..');

    await expect(
      modal.getByText(MAIN_NAME, {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      modal.getByText('41', {
        exact: true,
      }),
    ).toBeVisible();

    await modal
      .getByRole('button', {
        name: 'Закрыть',
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Детали ингредиента',
      }),
    ).not.toBeVisible();

    await expect(page).toHaveURL('/');
  });

  test('closes the ingredient modal by clicking the overlay', async ({
    page,
  }) => {
    await page.goto('/');

    await openIngredientModal(page, BUN_NAME);

    /*
     * Верхний левый угол находится вне окна модалки,
     * но внутри полноэкранного overlay.
     */
    await page.mouse.click(5, 5);

    await expect(
      page.getByRole('heading', {
        name: 'Детали ингредиента',
      }),
    ).not.toBeVisible();

    await expect(page).toHaveURL('/');
  });

  test('creates an order and clears the constructor', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem(
        'refreshToken',
        'fake-refresh-token',
      );
    });

    const userRequest = page.waitForResponse(
      (response) =>
        response.url() === `${API_URL}/auth/user` &&
        response.request().method() === 'GET',
    );

    await page.goto('/');

    await userRequest;

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    const orderRequest = page.waitForRequest(
      (request) =>
        request.url() === `${API_URL}/orders` &&
        request.method() === 'POST',
    );

    await page
      .getByRole('button', {
        name: 'Оформить заказ',
      })
      .click();

    const request = await orderRequest;

    expect(request.postDataJSON()).toEqual({
      ingredients: [
        'bun-1',
        'main-1',
        'bun-1',
      ],
    });

    await expect(
      page.getByText(ORDER_NUMBER, {
        exact: true,
      }),
    ).toBeVisible();

    const emptyBunSlots = page.getByText('Выберите булки', {
      exact: true,
    });

    await expect(emptyBunSlots).toHaveCount(2);
    await expect(emptyBunSlots.first()).toBeVisible();
    await expect(emptyBunSlots.nth(1)).toBeVisible();

    await expect(
      page.getByText('Выберите начинку', {
        exact: true,
      }),
    ).toBeVisible();

    await page
      .getByRole('button', {
        name: 'Закрыть',
      })
      .click();

    await expect(
      page.getByText(ORDER_NUMBER, {
        exact: true,
      }),
    ).not.toBeVisible();
  });
});
